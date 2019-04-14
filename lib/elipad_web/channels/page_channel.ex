defmodule ElipadWeb.PageChannel do
  use Phoenix.Channel

  def join("page:" <> page, _params, socket) do
    {:ok, assign(socket, :page, page)}
  end

  def handle_in("update_page", params, socket) do
    broadcast! socket, "update_page", %{body: params["body"]}
    {:reply, :ok, socket}
  end
end
