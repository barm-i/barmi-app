import axios from "axios";

export class FormComponent {
  status = true;
  containerElement;
  titleElement;
  usernameElement;
  passwordElement;
  usernameInputElement;
  passwordInputElement;
  buttonElement;
  textAreaElement;

  loginBody = {
    username: "yechan",
    password: "1234",
  };

  constructor() {
    this.containerElement = document.createElement("div");
  }

  setDomNode() {
    this.containerElement = document.createElement("div");
    this.titleElement = document.createElement("p");
    this.usernameElement = document.createElement("label");
    this.passwordElement = document.createElement("label");
    this.usernameInputElement = document.createElement("input");
    this.passwordInputElement = document.createElement("input");
    this.underElement = document.createElement("div");
    this.buttonElement = document.createElement("button");
    this.textAreaElement = document.createElement("p");

    this.containerElement.className = "card-container";
    this.titleElement.className = "title-class";
    this.usernameElement.className = "label-class";
    this.passwordElement.className = "label-class";
    this.usernameInputElement.className = "input-class";
    this.passwordInputElement.className = "input-class";
    this.textAreaElement.className = "link-class";

    this.titleElement.innerText = "로그인";
    this.usernameElement.innerText = "username";
    this.passwordElement.innerText = "password";
    this.buttonElement.innerText = "login";
    this.textAreaElement.innerHTML = `아직 회원이 아니신가요? <a class="text-area" href="#">회원가입</a>하기`;

    this.textAreaElement.addEventListener("click", () => {
      if (this.status) {
        this.status = false;
        this.convertSignUp();
      } else {
        this.status = true;
        this.convertLogIn();
      }
    });

    this.buttonElement.addEventListener("click", (event) => {
      event.preventDefault();

      login();

      //if (username === "1" && password === "1") {
      //alert("You have successfully logged in.");
      //TODO login 로직 짜기(server 통신, local storage 토큰저장)
      //login 로직
      //
      //window.location.href = "mainPage.html";
      //window.localStorage.setItem(loginId, username);
      //} else {
      //alert("정보없음");
      //}
    });
    // const login = async () => {
    //   const response = await axios.post(
    //     "http://localhost:8080/api/login",
    //     JSON.stringify({
    //       username: "123",
    //       password: "123",
    //     }),
    //     { "Content-Type": "application/json", withCredentials: true }
    //   );
    //   console.log(response.json());
    // };
    const login = async () => {
      const response = await axios.post("url", {});
      console.log(response.json());
    };

    let children = [
      this.titleElement,
      this.usernameElement,
      this.usernameInputElement,
      this.passwordElement,
      this.passwordInputElement,
      this.buttonElement,
      this.textAreaElement,
    ];
    this.containerElement.append(...children);
  }

  convertSignUp() {
    this.titleElement.innerText = "회원가입";
    this.buttonElement.innerText = "register";
    this.textAreaElement.innerHTML = `회원이신가요? <a class="text-area" href="#">로그인</a>하기`;
  }

  convertLogIn() {
    this.titleElement.innerText = "로그인";
    this.buttonElement.innerText = "login";
    this.textAreaElement.innerHTML = `아직 회원이 아니신가요? <a class="text-area" href="#">회원가입</a>하기`;
  }

  render() {
    this.setDomNode();
    document.getElementById("wrapper").appendChild(this.containerElement);
  }
}
