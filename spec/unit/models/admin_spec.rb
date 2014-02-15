require "archivos/models/admin"

describe Admin do
  describe "#authorized?" do
    it "responds with false if an admin with the given creds does not exist" do
      expect(Admin.authorized?("foo", "bar")).to be_false
    end

    it "responds with true if an admin with the given creds exists" do
      user = "bar"
      pass = "foo"
      Admin.create({ user_name: user, password: pass })

      expect(Admin.authorized?(user, pass)).to be_true
    end
  end
end
