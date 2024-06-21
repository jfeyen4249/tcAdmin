import hashlib
import os

def generate_key():
    random_bytes = os.urandom(32)
    hash_object = hashlib.sha256(random_bytes)
    key = hash_object.hexdigest()
    return key

print(generate_key())
