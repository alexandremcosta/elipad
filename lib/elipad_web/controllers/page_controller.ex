defmodule ElipadWeb.PageController do
  use ElipadWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def show(conn, %{"page" => path}) do
    render(conn, "show.html", path: path)
  end
end
