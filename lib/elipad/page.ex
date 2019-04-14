defmodule Elipad.Page do
  use Ecto.Schema
  import Ecto.Changeset

  schema "pages" do
    field :body, :string
    field :path, :string

    timestamps()
  end

  @doc false
  def changeset(page, attrs) do
    page
    |> cast(attrs, [:body, :path])
    |> unique_constraint(:path)
    |> validate_required([:body, :path])
  end
end
