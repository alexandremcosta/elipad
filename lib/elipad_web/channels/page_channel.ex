defmodule ElipadWeb.PageChannel do
  use Phoenix.Channel
  alias Elipad.Repo

  def join("page:" <> path, _params, socket) do
    %Elipad.Page{path: path}
    |> Repo.insert(on_conflict: :nothing)

    page = Repo.get_by(Elipad.Page, path: path)

    {:ok, page.body, assign(socket, :path, path)}
  end

  def handle_in(event, params, socket) do
    page = Repo.get_by(Elipad.Page, path: socket.assigns.path)
    handle_in(event, params, page, socket)
  end

  defp handle_in("update_page", %{"body" => body} = params, page, socket) do
    page
    |> Ecto.Changeset.change(%{body: body})
    |> Repo.update()

    broadcast! socket, "update_page", params
    {:reply, :ok, socket}
  end
end
