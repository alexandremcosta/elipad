defmodule ElipadWeb.PageController do
  use ElipadWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def index(conn, _params) do
    render(conn, "show.html")
  end
end
