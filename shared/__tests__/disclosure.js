const {
  getByLabelText,
  getByText,
  queryByTestId,
  waitFor,
} = require("@testing-library/dom");
const Disclosure = require("../disclosure.js");

function getExampleDOM() {
  const div = document.createElement("div");
  div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>
  `;
  const button = div.querySelector("button");
  const input = div.querySelector("input");
  button.addEventListener("click", () => {
    setTimeout(() => {
      const printedUsernameContainer = document.createElement("div");
      printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `;
      div.appendChild(printedUsernameContainer);
    }, Math.floor(Math.random() * 200));
  });
  return div;
}

function getDisclosureDOM(open) {
  const div = document.createElement("div");
  div.innerHTML = `
    <button aria-expanded="${
      "" + open
    }" aria-controls="content" data-disclosure-btn data-hidden-class="hidden">
      Click me!
    </button>
    <div id="content" class="${open ? "" : "hidden"}">
      <p>You're seeing the disclosure content</p>
    </div>
  `;
  return div;
}

console.log(getDisclosureDOM(false).innerHTML);

describe("API user", () => {
  test("can initialize a disclosure", () => {
    // Already closed disclosure
    // Test for open and closed disclosure
  });

  test("cannot initialize an out-of-sync disclosure", () => {});

  test("can initialize multiple disclosures", () => {});

  test("can toggle a disclosure", () => {});

  test("can add listener", () => {
    // Consider sync and async
  });

  test("can remove listener", () => {});
});

describe("Browser user", () => {
  test("can toggle a disclosure", () => {});
});

test("examples of some things", async () => {
  const famousWomanInHistory = "Ada Lovelace";
  const container = getExampleDOM();

  const input = getByLabelText(container, "Username");
  input.value = famousWomanInHistory;

  getByText(container, "Print Username").click();

  await waitFor(() =>
    expect(queryByTestId(container, "printed-username")).toBeTruthy()
  );
});
