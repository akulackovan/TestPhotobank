import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "../pages/AuthPage/AuthPage";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import RegPage from "../pages/RegPage/RegPage"
import { act } from "react-dom/test-utils";

jest.mock("axios");

const mockCityItem = {
  data: {
    city: [
      { _id: "63b9473e70bfa1abe160400f", city: "Москва" },
      { _id: "63b94e8d70bfa1abe1604015", city: "Санкт-Петербург" },
      { _id: "63b96121b19de65ebdf4cd50", city: "Абаза\r", __v: 0 },
    ],
  },
  status: 200,
};

beforeEach(() => {
  axios.get.mockResolvedValue(mockCityItem);

    render(
        <RegPage />
    );
});
afterEach(() => {
  jest.clearAllMocks();
});

describe("PegPage component", () => {
  it("Should the filling of PegPage components", () => {
    const username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
    const password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    
    expect(screen.getByTestId("city")).toBeInTheDocument()
    const regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
    expect(regButton).toBeInTheDocument();

    const mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
    const cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
  });

});

describe("PegPage component test field", () => {
  let username, password, regButton, mainField,cities ;

  const moreThe128 = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  const wrongSymbols = "123"
  const wrongAnd128 = "111112222222222224444444444444444444444444444444444444444444422222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222"
  const ok = "test"

  beforeEach(() => {
     username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    
    expect(screen.getByTestId("city")).toBeInTheDocument()
     regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
    expect(regButton).toBeInTheDocument();

     mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
     cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
  });

  it("Should with error All empty", () => {
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error  Empty username and password length more then 128 and city is correct", () => {
    
    fireEvent.change(username, { target: { value: "" } });
    fireEvent.change(password, { target: { value: moreThe128 } });
    fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error Empty username and password has wrong symbols and city is empty", () => {
    
    fireEvent.change(username, { target: { value: "" } });
    fireEvent.change(password, { target: { value: wrongSymbols } });
    //fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error Empty username and password is correct and city", () => {
    
    fireEvent.change(username, { target: { value: "" } });
    fireEvent.change(password, { target: { value: ok } });
    fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  //5
  it("Should with error Empty username and password is correct and city is empty", () => {
    
    fireEvent.change(username, { target: { value: "" } });
    fireEvent.change(password, { target: { value: wrongAnd128 } });
    fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error Username length more then 128 and password length more then 128  and city is empty", () => {
    
    fireEvent.change(username, { target: { value: moreThe128 } });
    fireEvent.change(password, { target: { value: moreThe128 } });
    //fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error Username length more then 128 and password has wrong symbols and city", () => {
    
    fireEvent.change(username, { target: { value: moreThe128 } });
    fireEvent.change(password, { target: { value: wrongSymbols } });
    fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Логин должен содержать до 128 символов")).toBeInTheDocument();
  });

  it("Should with error Username length more then 128 and password is correct and city is empty", () => {
    
    fireEvent.change(username, { target: { value: moreThe128 } });
    fireEvent.change(password, { target: { value: ok } });
    //fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  it("Should with error Username length more then 128 and password is uncorrect and city is empty", () => {
    
    fireEvent.change(username, { target: { value: moreThe128 } });
    fireEvent.change(password, { target: { value: wrongAnd128 } });
    //fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

  //10
  it("Should with error Username length more then 128 and password is empty and city", () => {
    
    fireEvent.change(username, { target: { value: moreThe128 } });
    fireEvent.change(password, { target: { value: "" } });
    fireEvent.click(screen.getByText("Москва"));
    fireEvent.click(regButton);
    expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
  });

    //11
    it("Should with error Username has wrong symbols and password has wrong symbols and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongSymbols } });
      fireEvent.change(password, { target: { value: wrongSymbols } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username has wrong symbols and password is ok and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongSymbols } });
      fireEvent.change(password, { target: { value: ok } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username has wrong symbols and password is uncorrect and city", () => {
    
      fireEvent.change(username, { target: { value: wrongSymbols } });
      fireEvent.change(password, { target: { value: wrongAnd128 } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Логин должен содержать только символы русского и английского алфавита")).toBeInTheDocument();
    });

    it("Should with error Username has wrong symbols and password is empty and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongSymbols } });
      fireEvent.change(password, { target: { value: "" } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });


    //15
    it("Should with error Username has wrong symbols and password length more then 128 and city", () => {
    
      fireEvent.change(username, { target: { value: wrongSymbols } });
      fireEvent.change(password, { target: { value: moreThe128 } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Логин должен содержать только символы русского и английского алфавита")).toBeInTheDocument();
    });

    //17
    it("Should with error Username is correct and password is uncorrect and city is empty", () => {
    
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: wrongAnd128 } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username is correct and password is empty and city", () => {
    
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: "" } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username is correct and password lenght more then 128 and city", () => {
    
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: moreThe128 } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Пароль должен содержать до 128 символов")).toBeInTheDocument();
    });

    //20
    it("Should with error Username is correct and password has uncorrect symbols and city", () => {
    
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: wrongSymbols } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Пароль должен содержать только символы русского и английского алфавита")).toBeInTheDocument();
    });

    
    it("Should with error Username is uncorrect and password is uncorrect and city", () => {
    
      fireEvent.change(username, { target: { value: wrongAnd128 } });
      fireEvent.change(password, { target: { value: wrongAnd128 } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Логин должен содержать только символы русского и английского алфавита")).toBeInTheDocument();
    });

    it("Should with error Username is uncorrect and password is empty and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongAnd128 } });
      fireEvent.change(password, { target: { value: wrongAnd128 } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username is uncorrect and password lenght more then 128 and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongAnd128 } });
      fireEvent.change(password, { target: { value: moreThe128 } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should with error Username is uncorrect and password has wrong symbols and city", () => {
    
      fireEvent.change(username, { target: { value: wrongAnd128 } });
      fireEvent.change(password, { target: { value: wrongSymbols } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Логин должен содержать только символы русского и английского алфавита")).toBeInTheDocument();
    });

    it("Should with error Username is uncorrect and password has wrong symbols and city is empty", () => {
    
      fireEvent.change(username, { target: { value: wrongAnd128 } });
      fireEvent.change(password, { target: { value: ok } });
      //fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

});

describe("PegPage right field", () => {
  let username, password, regButton, mainField,cities ;

   const ok = "test"

  beforeEach(() => {
     username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    
    expect(screen.getByTestId("city")).toBeInTheDocument()
     regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
    expect(regButton).toBeInTheDocument();

     mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
     cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
  });


    it("Should with error Username has wrong symbols and password is empty and city is empty", async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: "Ошибка при авторизации",
          },
        },
        status: 400,
      });
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: ok } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });


    it("Should with error Username has wrong symbols and password is empty and city is empty", async () => {
      axios.post.mockResolvedValueOnce({
        
          data: {
            message: "Регистрация успешна",
            newUser: "user",
            token: "token"
          },
        
      });
      fireEvent.change(username, { target: { value: ok } });
      fireEvent.change(password, { target: { value: ok } });
      fireEvent.click(screen.getByText("Москва"));
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });


});


describe("PegPage username lenght", () => {
  let username, password, regButton, mainField,cities ;

   const ok = "test"

  beforeEach(() => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при авторизации",
        },
      },
      status: 400,
    });
     username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    
    expect(screen.getByTestId("city")).toBeInTheDocument()
     regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
    expect(regButton).toBeInTheDocument();

     mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
     cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
    fireEvent.change(password, { target: { value: ok } });
    fireEvent.click(screen.getByText("Москва"));
    
  });

    it("Should print error with empty username ", async () => {
      fireEvent.change(username, { target: { value: "" } });
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });

    it("Should not print error with 1 lenght username ", async () => {
      fireEvent.change(username, { target: { value: "a" } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 127 lenght username ", async () => {
      var user = "";
    while (user.length < 127) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 128 lenght username ", async () => {
      var user = "";
    while (user.length < 128) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should  print error with 129 lenght username ", async () => {
      var user = "";
    while (user.length < 129) user += "A";
      fireEvent.change(username, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Логин должен содержать до 128 символов")).toBeInTheDocument();
    });
});

describe("PegPage password lenght", () => {
  let username, password, regButton, mainField,cities ;

   const ok = "test"

  beforeEach(() => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Ошибка при авторизации",
        },
      },
      status: 400,
    });
     username = screen.getByPlaceholderText("Логин");
    expect(username).toBeInTheDocument();
     password = screen.getByPlaceholderText("Пароль");
    expect(password).toBeInTheDocument();
    
    expect(screen.getByTestId("city")).toBeInTheDocument()
     regButton = screen.getByText("ЗАРЕГИСТРИРОВАТЬСЯ");
    expect(regButton).toBeInTheDocument();

     mainField = screen.getByText("Город");
    expect(mainField).toBeInTheDocument();
    fireEvent.click(mainField);
     cities = screen.getAllByTestId("city-dropdownelement");
    expect(cities).toBeDefined();
    expect(cities).toHaveLength(3);
    fireEvent.change(username, { target: { value: ok } });
    fireEvent.click(screen.getByText("Москва"));
    
  });


    it("Should print error with empty username ", async () => {
      fireEvent.change(password, { target: { value: "" } });
      fireEvent.click(regButton);
      expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
    });


    it("Should not print error with 1 lenght username ", async () => {
      fireEvent.change(password, { target: { value: "a" } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 127 lenght username ", async () => {
      var user = "";
    while (user.length < 127) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should not print error with 128 lenght username ", async () => {
      var user = "";
    while (user.length < 128) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Ошибка при авторизации")).toBeInTheDocument();
    });

    it("Should  print error with 129 lenght username ", async () => {
      var user = "";
    while (user.length < 129) user += "A";
      fireEvent.change(password, { target: { value: user } });
      fireEvent.click(regButton);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByText("Пароль должен содержать до 128 символов")).toBeInTheDocument();
    });
});







