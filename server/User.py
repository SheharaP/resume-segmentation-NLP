import bcrypt


class User:
    def __init__(self, company_name, email, password):
        self.company_name = company_name
        self.email = email
        self.password = self._hash_password(password)

    def _hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed_password

    def validate_password(hashed_password, input_password):
        return bcrypt.checkpw(input_password.encode("utf-8"), hashed_password)





