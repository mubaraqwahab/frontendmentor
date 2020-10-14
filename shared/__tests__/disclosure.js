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

describe("API user", () => {
  test("can initialize a closed disclosure", () => {});

  test("can initialize a open disclosure", () => {});
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
