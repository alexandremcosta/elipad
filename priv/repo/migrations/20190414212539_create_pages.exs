defmodule Elipad.Repo.Migrations.CreatePages do
  use Ecto.Migration

  def change do
    create table(:pages) do
      add :body, :text
      add :path, :string

      timestamps()
    end
    create unique_index(:pages, [:path])
  end
end
