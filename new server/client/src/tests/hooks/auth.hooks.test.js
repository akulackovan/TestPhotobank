import {useAuth} from '../../hooks/auth.hook'
import { renderHook, act } from "@testing-library/react-hooks";


describe("AuthHook", () => {
  it("Should login", () => {
    const {result} = renderHook(() => useAuth())
    
    act(() => {
      result.current.login("token", "userId")
    })
    expect(result.current.userId).toBe("userId")
    expect(result.current.token).toBe("token")
  });


  it("Should logout", () => {
    const {result} = renderHook(() => useAuth())
    
    act(() => {
      result.current.login("token", "userId")
    })
    expect(result.current.userId).toBe("userId")
    expect(result.current.token).toBe("token")
    act(() => {
      result.current.logout()
    })
    expect(result.current.userId).toBe(null)
    expect(result.current.token).toBe(null)
    
  });
});