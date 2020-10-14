const { beforeAll, describe, expect, test } = require("@jest/globals");
const {
  getByLabelText,
  getByText,
  queryByTestId,
  waitFor,
} = require("@testing-library/dom");
const Disclosure = require("../disclosure.js").default;

function setupDisclosureDOM(container, sync = true) {
  container.innerHTML = `
    <button aria-expanded="${!sync}" aria-controls="content" data-disclosure-btn data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content" class="hidden">
      You're seeing the disclosure content
    </div>
  `;
}

/** @type {Disclosure} */
let disclosure;

beforeAll(() => setupDisclosureDOM(document.body));

describe("API user", () => {
  test("can initialize a disclosure", () => {
    const button = getByText(document, /click/i);
    const content = getByText(document, /content/i);

    disclosure = new Disclosure(button);
    expect(disclosure.button).toBe(button);
    expect(disclosure.controlledElement).toBe(content);
  });

  test("cannot initialize an out-of-sync disclosure", () => {
    const container = document.createElement("div");
    setupDisclosureDOM(container, false);
    const button = getByText(container, /click/i);

    // expect(() => new Disclosure(button)).toThrow();
  });

  test("can initialize multiple disclosures", () => {});

  test("can toggle a disclosure", () => {
    disclosure.open = true;
    disclosure.toggle();
    expect(disclosure.open).toBe(false);

    // With `force` param
    disclosure.toggle(false);
    expect(disclosure.open).toBe(false);
  });

  test("can add listener", () => {
    const mockCallback = jest.fn();

    disclosure.addListener(mockCallback);
    disclosure.toggle();

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ target: disclosure });
  });

  test("can remove listener", () => {
    const mockCallback = jest.fn();
    disclosure.addListener(mockCallback);
    disclosure.removeListener(mockCallback);
    disclosure.toggle();
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});

describe("Browser user", () => {
  test("can toggle a disclosure", () => {
    disclosure.open = false;
    getByText(document, /click/i).click();
    expect(disclosure.open).toBe(true);
  });
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
