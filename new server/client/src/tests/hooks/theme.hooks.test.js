import {useTheme} from '../../hooks/use.theme'
import { renderHook, act } from "@testing-library/react-hooks";


describe("ThemeHook", () => {
  it("Should dark", () => {
    const {result} = renderHook(() => useTheme())
    result.current.theme = "dark";
    
    expect( result.current.theme).toBe("dark")
  });


  it("Should light", () => {
    const {result} = renderHook(() => useTheme())
    result.current.theme = "light";
    
    expect( result.current.theme).toBe("light")
    
  });
});