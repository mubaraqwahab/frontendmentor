const { describe, expect, test } = require("@jest/globals");
const {
  getByLabelText,
  getByText,
  queryByTestId,
  waitFor,
} = require("@testing-library/dom");
const Disclosure = require("../disclosure.js").default;

function getDisclosureDOM(open = false, sync = true) {
  let ariaExpanded;
  if (sync) {
    ariaExpanded = "" + open;
  } else {
    ariaExpanded = "" + !open;
  }
  const div = document.createElement("div");
  div.innerHTML = `
    <button aria-expanded="${ariaExpanded}" aria-controls="content" data-disclosure-btn data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content" class="${open ? "" : "hidden"}">
      You're seeing the disclosure content
    </div>
  `;
  return div;
}

describe("API user", () => {
  /** @type {Disclosure} */
  let disclosure;

  test("can initialize a closed disclosure", () => {
    const container = getDisclosureDOM(false);
    const button = getByText(container, /click/i);
    const content = getByText(container, /content/i);

    const closedDisclosure = new Disclosure(button, container);
    expect(closedDisclosure.button).toBe(button);
    expect(closedDisclosure.controlledElement).toBe(content);

    disclosure = closedDisclosure;
  });

  test("can initialize an open disclosure", () => {
    const container = getDisclosureDOM(true);
    const button = getByText(container, /click/i);
    const content = getByText(container, /content/i);

    const closedDisclosure = new Disclosure(button, container);
    expect(closedDisclosure.button).toBe(button);
    expect(closedDisclosure.controlledElement).toBe(content);
  });

  test("cannot initialize an out-of-sync disclosure", () => {
    const container = getDisclosureDOM(false);
    const button = getByText(container, /click/i);

    // expect(() => new Disclosure(button, outOfSyncContainer)).toThrow();
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
