import { chromium } from "playwright-core";
import { mkdtemp } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const extensionPath = resolve(".");
const userDataDir = await mkdtemp(join(tmpdir(), "corrector-catala-"));
const bravePath = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";
const badText = "hola bon diia aquest correctro funciona sense servidro";
const goodText = "hola bon dia aquest corrector funciona sense servidor";
const badWords = ["diia", "correctro", "servidro"];

const server = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(`<!doctype html>
    <html lang="ca">
      <body>
        <label>Textarea <textarea id="textarea" rows="6" cols="70">${badText}</textarea></label>
        <label>Input <input id="input" type="text" value="${badText}" size="70"></label>
        <div id="editable" contenteditable="true" style="border:1px solid #ccc; padding:12px; width:620px;">${badText}</div>
      </body>
    </html>`);
});

await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
const { port } = server.address();

const context = await chromium.launchPersistentContext(userDataDir, {
  executablePath: bravePath,
  headless: false,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`
  ]
});

try {
  const page = await context.newPage();
  const logs = [];
  page.on("console", (message) => logs.push(`${message.type()}: ${message.text()}`));
  page.on("pageerror", (error) => logs.push(`pageerror: ${error.message}`));

  await page.goto(`http://127.0.0.1:${port}/`);

  const textareaResult = await testFieldAssistant(page, "#textarea", "value");
  const inputResult = await testFieldAssistant(page, "#input", "value");
  const editableResult = await testFieldAssistant(page, "#editable", "textContent");
  const popupResult = await testPopup(context);

  const summary = {
    textarea: textareaResult,
    input: inputResult,
    contenteditable: editableResult,
    popup: popupResult,
    logs
  };

  console.log(JSON.stringify(summary, null, 2));
} finally {
  await context.close();
  server.close();
}

async function testFieldAssistant(page, selector, readProperty) {
  const field = page.locator(selector);
  await field.click();
  await page.waitForSelector("#corrector-catala-field-assistant", { state: "attached", timeout: 5000 });

  const host = page.locator("#corrector-catala-field-assistant");
  await page.waitForFunction(() => {
    const hostElement = document.querySelector("#corrector-catala-field-assistant");
    const button = hostElement?.shadowRoot?.querySelector(".trigger");
    return button && !button.hidden;
  }, { timeout: 5000 });

  await host.evaluate((element) => {
    element.shadowRoot.querySelector(".trigger").click();
  });

  await waitForPanel(page);
  await waitForErrors(page);

  const before = await readPanelState(host);
  assertDetectsExpectedErrors(before.results, `${selector} detects errors`);

  await host.evaluate((element) => {
    element.shadowRoot.querySelector("[data-action='fix']").click();
  });
  await page.waitForTimeout(300);

  const afterFix = await host.evaluate((element) => element.shadowRoot.querySelector("textarea").value);
  assertBadWordsRemoved(afterFix, `${selector} auto fix removes bad words`);

  await host.evaluate((element) => {
    element.shadowRoot.querySelector("[data-action='apply']").click();
  });

  await page.waitForFunction(() => {
    const hostElement = document.querySelector("#corrector-catala-field-assistant");
    const panel = hostElement?.shadowRoot?.querySelector(".panel");
    return panel?.hidden;
  }, { timeout: 5000 });

  const applied = await field.evaluate((element, property) => element[property], readProperty);
  assertBadWordsRemoved(applied, `${selector} apply writes corrected text`);

  return {
    status: before.status,
    fixedText: afterFix,
    appliedText: applied
  };
}

async function testPopup(context) {
  const serviceWorker = context.serviceWorkers()[0] ?? await context.waitForEvent("serviceworker");
  const extensionId = new URL(serviceWorker.url()).host;
  const popup = await context.newPage();

  await popup.goto(`chrome-extension://${extensionId}/src/popup/popup.html`);
  await popup.locator("#text-input").fill(badText);
  await popup.locator("#check-text").click();
  await popup.waitForFunction(() => {
    const status = document.querySelector("#status")?.textContent ?? "";
    return status.includes("possible") && status.includes("error");
  }, { timeout: 15000 });

  const detected = await popup.evaluate(() => ({
    status: document.querySelector("#status")?.textContent,
    results: document.querySelector("#results")?.textContent
  }));
  assertDetectsExpectedErrors(detected.results, "popup detects errors");

  await popup.locator("#auto-fix").click();
  await popup.waitForTimeout(300);
  const fixedText = await popup.locator("#text-input").textContent({ timeoutMs: 5000 });
  const fixedValue = await popup.locator("#text-input").evaluate((element) => element.value);
  assertBadWordsRemoved(fixedValue, "popup auto fix removes bad words");

  await popup.locator("#text-input").fill(goodText);
  await popup.locator("#check-text").click();
  await popup.waitForFunction(() => {
    const status = document.querySelector("#status")?.textContent ?? "";
    return status === "Text revisat";
  }, { timeout: 15000 });

  return {
    detectedStatus: detected.status,
    fixedText: fixedValue || fixedText,
    cleanStatus: await popup.locator("#status").textContent({ timeoutMs: 5000 })
  };
}

async function waitForPanel(page) {
  await page.waitForFunction(() => {
    const hostElement = document.querySelector("#corrector-catala-field-assistant");
    const panel = hostElement?.shadowRoot?.querySelector(".panel");
    return panel && !panel.hidden;
  }, { timeout: 5000 });
}

async function waitForErrors(page) {
  await page.waitForFunction(() => {
    const hostElement = document.querySelector("#corrector-catala-field-assistant");
    const status = hostElement?.shadowRoot?.querySelector(".meta")?.textContent ?? "";
    return status.includes("possible") && status.includes("error");
  }, { timeout: 15000 });
}

async function readPanelState(host) {
  return host.evaluate((element) => ({
    status: element.shadowRoot.querySelector(".meta").textContent,
    results: element.shadowRoot.querySelector(".results").textContent
  }));
}

function assertDetectsExpectedErrors(text, label) {
  for (const word of badWords) {
    if (!text.includes(word)) {
      throw new Error(`${label}: expected "${word}" in results, got "${text}".`);
    }
  }
}

function assertBadWordsRemoved(text, label) {
  for (const word of badWords) {
    if (text.includes(word)) {
      throw new Error(`${label}: "${word}" was not corrected in "${text}".`);
    }
  }

  if (!text.includes("dia")) {
    throw new Error(`${label}: expected duplicate-letter correction "dia", got "${text}".`);
  }
}
