export class LeftContainer {
  status = true;
  containerElement;
  logoElement;
  menuElement;
  leaderBoardElement;

  constructor() {
    this.containerElement = document.createElement("div");
  }

  setDomNode() {
    this.containerElement = document.createElement("div");
    this.logoElement = document.createElement("p");
    this.menuElement = document.createElement("p");
    this.leaderBoardElement = document.createElement("p");

    this.containerElement.className = "card-container";
    this.logoElement.className = "title-class";
    this.menuElement.className = "title-class";
    this.leaderBoardElement.className = "title-class";

    this.logoElement.innerText = "바르미";
    this.menuElement.innerText = "Menu";
    this.leaderBoardElement.innerText = "leaderboard";
    // this.buttonElement.innerText = "login";
    // this.textAreaElement.innerHTML = `아직 회원이 아니신가요? <a class="text-area" href="#">회원가입</a>하기`;

    let children = [
      this.logoElement,
      this.menuElement,
      this.leaderBoardElement,
    ];
    this.containerElement.appendChild(...children);
  }
  render() {
    this.setDomNode();
    document
      .getElementById("left-container")
      .appendChild(this.containerElement);
  }
}
