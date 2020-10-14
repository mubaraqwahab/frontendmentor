const { describe, expect, test } = require("@jest/globals");
const {
  getByLabelText,
  getByText,
  queryByTestId,
  waitFor,
} = require("@testing-library/dom");
const Disclosure = require("../disclosure.js").default;

function setupDisclosureDOM(sync = true) {
  document.body.innerHTML = `
    <button aria-expanded="${!sync}" aria-controls="content" data-disclosure-btn data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content" class="hidden">
      You're seeing the disclosure content
    </div>
  `;
}

describe("API user", () => {
  setupDisclosureDOM();

  /** @type {Disclosure} */
  let disclosure;

  test("can initialize a disclosure", () => {
    const button = getByText(document, /click/i);
    const content = getByText(document, /content/i);

    disclosure = new Disclosure(button, document);
    expect(disclosure.button).toBe(button);
    expect(disclosure.controlledElement).toBe(content);
  });

  test("cannot initialize an out-of-sync disclosure", () => {
    setupDisclosureDOM(false);
    const button = getByText(document, /click/i);

    // expect(() => new Disclosure(button, outOfSyncContainer)).toThrow();

    // Return back to normal
    setupDisclosureDOM();
  });

  test("can initialize multiple disclosures", () => {});

  test("can toggle a disclosure", () => {
    disclosure.open = true;
    disclosure.toggle();
    expect(disclosure.open).toBe(false);

    // Force
    disclosure.toggle(false);
    expect(disclosure.open).toBe(false);
  });

  test("can add listener", () => {
    // Consider sync and async
  });

  test("can remove listener", () => {});
});

describe("Browser user", () => {
  test("can toggle a disclosure", () => {});
});

// test("examples of some things", async () => {
//   const famousWomanInHistory = "Ada Lovelace";
//   const container = getExampleDOM();

//   const input = getByLabelText(container, "Username");
//   input.value = famousWomanInHistory;

//   getByText(container, "Print Username").click();

//   await waitFor(() =>
//     expect(queryByTestId(container, "printed-username")).toBeTruthy()
//   );
// });
