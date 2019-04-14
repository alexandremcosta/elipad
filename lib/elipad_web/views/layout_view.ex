defmodule ElipadWeb.LayoutView do
  use ElipadWeb, :view

  def user_token(size \\ 16) do
    size
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64
    |> binary_part(0, size)
  end
end
