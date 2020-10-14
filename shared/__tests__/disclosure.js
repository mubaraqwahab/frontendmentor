const { beforeAll, describe, expect, test, jest } = require("@jest/globals");
const { getByText } = require("@testing-library/dom");
const { default: Disclosure, DisclosureError } = require("../disclosure.js");

function setupDisclosureDOM(container, sync = true, multiple = false) {
  const template = (n) => `
    <button aria-expanded="${!sync}" aria-controls="content${n}" data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content${n}" class="hidden">
      You're seeing the disclosure content
    </div>
  `;
  container.innerHTML = multiple ? template(1) + template(2) : template(1);
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

  // TODO: test cannot initialize disclosure from incomplete DOM

  test("cannot initialize an out-of-sync disclosure", () => {
    const container = document.createElement("div");
    setupDisclosureDOM(container, false);
    const button = getByText(container, /click/i);
    expect(() => new Disclosure(button, container)).toThrow(DisclosureError);
  });

  test("can initialize multiple disclosures", () => {
    const container = document.createElement("div");
    setupDisclosureDOM(container, true, true);

    const disclosures = Disclosure.initializeAll("button", container);

    expect(disclosures).toHaveLength(2);
    expect(disclosures[0]).toBeInstanceOf(Disclosure);
    expect(disclosures[1]).toBeInstanceOf(Disclosure);
  });

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
