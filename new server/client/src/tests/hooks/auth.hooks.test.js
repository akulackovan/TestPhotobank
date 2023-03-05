import { useAuth } from "../../hooks/auth.hook";
import { renderHook, act } from "@testing-library/react-hooks";
import jwt from "jsonwebtoken";

describe("AuthHook", () => {
  it("Should login", async () => {
    const { result, rerender } = renderHook(() => useAuth());
    let token = jwt.sign(
      {
        id: "userId",
      },
      "0a6b944d-d2fb-46fc-a85e-0295c986cd9f",
      { expiresIn: 1 }
    );
    act(() => {
      result.current.login(token, "userId");
    });
    expect(result.current.userId).toBe("userId");
    expect(result.current.token).toBe(token);
  });

  it("Should logout", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        "userId"
      );
    });
    expect(result.current.userId).toBe("userId");
    expect(result.current.token).toBe(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
    act(() => {
      result.current.logout();
    });
    expect(result.current.userId).toBe(null);
    expect(result.current.token).toBe(null);
  });
});
