import { expect, test } from "@jest/globals";
import { getByText } from "@testing-library/dom";
import Disclosure, { initializeAll } from "../disclosure.js";

function setup() {
  const container = document.createElement("div");
  container.innerHTML = `
    <button
      aria-expanded="false"
      aria-controls="content"
      data-hidden-class="hidden"
    >
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

test("cannot initialize disclosure from invalid DOM", () => {
  const container = document.createElement("div");
  container.innerHTML = `
    <!-- No aria-expanded -->
    <button
      id="noAriaExpanded"
      aria-controls="content1"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content1" class="hidden">
      You're seeing the disclosure content
    </div>

    <!-- Invalid aria-expanded -->
    <button
      id="invalidAriaExpanded"
      aria-expanded="hi"
      aria-controls="content2"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content2" class="hidden">
      You're seeing the disclosure content
    </div>

    <!-- No aria-controls -->
    <button
      id="noAriaControls"
      aria-expanded="false"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content3" class="hidden">
      You're seeing the disclosure content
    </div>

    <!-- Invalid aria-controls -->
    <button
      id="invalidAriaControls"
      aria-expanded="false"
      aria-controls="content44"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content4" class="hidden">
      You're seeing the disclosure content
    </div>

    <!-- No data-hidden-class -->
    <button
      id="noDataHiddenClass"
      aria-expanded="false"
      aria-controls="content5"
    >
      Click me!
    </button>
    <div id="content5" class="hidden">
      You're seeing the disclosure content
    </div>

    <!-- Out-of-sync -->
    <button
      id="outOfSync"
      aria-expanded="true"
      aria-controls="content6"
      data-hidden-class="hidden"
    >
      Click me!
    </button>
    <div id="content6" class="hidden">
      You're seeing the disclosure content
    </div>
  `;

  expect(
    () => new Disclosure(container.querySelector("#noAriaExpanded"), container)
  ).toThrow(/aria-expanded.*must be present/i);

  expect(
    () =>
      new Disclosure(container.querySelector("#invalidAriaExpanded"), container)
  ).toThrow(/aria-expanded.*must be.*true.*false/i);

  expect(
    () => new Disclosure(container.querySelector("#noAriaControls"), container)
  ).toThrow(/aria-controls.*must be present/i);

  expect(
    () =>
      new Disclosure(container.querySelector("#invalidAriaControls"), container)
  ).toThrow(/aria-controls.*no element.*id/i);

  expect(
    () =>
      new Disclosure(container.querySelector("#noDataHiddenClass"), container)
  ).toThrow(/data-hidden-class.*must be present/i);

  expect(
    () => new Disclosure(container.querySelector("#outOfSync"), container)
  ).toThrow(/aria-expanded.*value.*class.*present/i);
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

  const disclosures = initializeAll(container);

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
