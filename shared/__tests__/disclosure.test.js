import { expect, test } from "@jest/globals";
import { getByText } from "@testing-library/dom";
import Disclosure, { DisclosureError } from "../disclosure.js";

function setup({ inSync = true } = {}) {
  const container = document.createElement("div");
  container.innerHTML = `
    <button aria-expanded="${!inSync}" aria-controls="content" data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content" class="hidden">
      You're seeing the disclosure content
    </div>
  `;
  const button = container.querySelector("button");
  const disclosure = new Disclosure(button, container);

  return {
    container,
    button,
    disclosure,
  };
}

test("can initialize a disclosure", () => {
  const { container, button, disclosure } = setup();
  const content = container.querySelector("[id^='content']");

  expect(disclosure.button).toBe(button);
  expect(disclosure.controlledElement).toBe(content);
});

// TODO: test cannot initialize disclosure from incomplete DOM i.e.: when:
// aria-expanded or aria-controls or data-hidden-class, or controlled elem is missing

test("cannot initialize an out-of-sync disclosure", () => {
  expect(() => setup({ inSync: false })).toThrow(DisclosureError);
});

test("can initialize multiple disclosures", () => {
  const container = document.createElement("div");
  container.innerHTML = `
    <button
      aria-expanded="false"
      data-disclosure-btn
      aria-controls="content1"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content1" class="hidden">
      You're seeing the disclosure content
    </div>

    <button
      aria-expanded="true"
      data-disclosure-btn
      aria-controls="content2"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content2">
      You're seeing the disclosure content
    </div>

    <!-- Missing data-disclosure attribute. -->
    <button
      aria-expanded="true"
      aria-controls="content3"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content3">
      You're seeing the disclosure content
    </div>
  `;

  const disclosures = Disclosure.initializeAll(container);

  expect(disclosures).toHaveLength(2);
  expect(disclosures[0]).toBeInstanceOf(Disclosure);
  expect(disclosures[1]).toBeInstanceOf(Disclosure);
});

test("can toggle a disclosure", () => {
  const { disclosure, container } = setup();

  disclosure.open = true;
  disclosure.toggle();
  expect(disclosure.open).toBe(false);

  // With `force` param
  disclosure.toggle(false);
  expect(disclosure.open).toBe(false);

  getByText(container, /click/i).click();
  expect(disclosure.open).toBe(true);
});

test("can add listener", () => {
  const { disclosure } = setup();
  const mockCallback = jest.fn();

  disclosure.addListener(mockCallback);
  disclosure.toggle();

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith({ target: disclosure });
});

test("can remove listener", () => {
  const { disclosure } = setup();
  const mockCallback = jest.fn();

  disclosure.addListener(mockCallback);
  disclosure.removeListener(mockCallback);
  disclosure.toggle();

  expect(mockCallback).toHaveBeenCalledTimes(0);
});
