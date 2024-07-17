import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  const isfetching = useIsFetching()
  return (
    <>
      <div id="main-header-loading"></div>
      {isfetching > 0 && <progress />}
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
