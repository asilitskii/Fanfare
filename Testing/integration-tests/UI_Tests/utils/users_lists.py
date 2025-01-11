from operator import itemgetter
from omkar_temp_mail import TempMail
import uuid

base_users = [
    {"name": "valid_user", "email": "universal.mister@mail.ru", "password": "Qwerty123", "first_name": "Names", "last_name": "Sur", "birth_date": "2000-12-12"},
    {"name": "invalid_user_correct_email_password", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Names^^", "last_name": "S", "birth_date": "2000-12-12"}
]

invalid_users_spec_symbols_email = [
    {"name": "invalid_user_!", "email": "invalid!User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_#", "email": "invalid#User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_$", "email": "invalid$User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_%", "email": "invalid%User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_'", "email": "invalid'User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_*", "email": "invalid*User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_+", "email": "invalid+User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_/", "email": "invalid/User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_?", "email": "invalid?User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_^", "email": "invalid^User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_`", "email": "invalid`User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_{", "email": "invalid{User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_|", "email": "invalid|User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_}", "email": "invalid}User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_~", "email": "invalid~User@test.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_dot_in_email = [
    {"name": "invalid_user_dot_first_symbol", "email": ".John.Doe@example.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_dot_last_symbol", "email": "John.Doe.@example.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_multiple_dots_in_row", "email": "John..D...oe@example.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_no_dot_in_domain", "email": "Johnoe@examplecom", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_len_email = [
    {"name": "invalid_user_max_len", "email": "ueaOSEyLMIETesKEROlWRZOrjMQCxOSsUHaHIOMSsjOtXSzdsSdJSymJMgvnXNoGoDEIbuiuxbEXkDfGzkEOvpBjnVZSNXBJCtGEZgOvmsisOajDQELKuwzAA@mail.ru", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_min_len", "email": "@example.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_spaces_email = [
    {"name": "invalid_user_space_before_email", "email": " @example.com", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_space_after_email", "email": " @example.com ", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_space_in_middle_of_email", "email": " @exam ple.com ", "password": "ValidPassword1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_password = [
    {"name": "invalid_user_min_len", "email": "invalidUser@test.com", "password": "Q111111", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_max_len", "email": "invalidUser@test.com", "password": "rsBnvCVqzeAaBYSajeanhcgVXFVnRELrRNNediUfSDTjPqzJmzSTtPctoyTTiyiV1", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_no_capital_letter", "email": "invalidUser@test.com", "password": "q1111111", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_no_digit_character", "email": "invalidUser@test.com", "password": "QQQQQQQQ", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_non_english_letters = [
    {"name": "invalid_user_cyrillic_symb", "email": "ыыыы@test.com", "password": "А111111", "first_name": "Names", "last_name": "Sur", "birth_date": "12122000"},
]

invalid_users_len_names = [
    {"name": "invalid_user_min_first", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "N", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_max_first", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Namessssssssssssssssssssssssssssssssssssssssssssssssssssssss", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_min_last", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Names", "last_name": "S", "birth_date": "12122000"},
    {"name": "invalid_user_max_first", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Names", "last_name": "SurNamessssssssssssssssssssssssssssssssssssssssssssssssssssssss", "birth_date": "12122000"},
    {"name": "invalid_user_spec_symb_first", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Names#", "last_name": "Sur", "birth_date": "12122000"},
    {"name": "invalid_user_spec_symb_last", "email": "invalidUser@test.com", "password": "qwert1235Q", "first_name": "Names", "last_name": "Su?r", "birth_date": "12122000"},
]

def get_user_by_name(name, users_list):
    try:
        return next(user for user in users_list if user["name"] == name)
    except:
        print("\n     User %s is not defined, enter a valid user.\n" % name)

def generate_user_email():
    length_prefix = 8
    username = uuid.uuid4().hex[:length_prefix].lower()
    tempmail = TempMail.generate_email(username)
    
    return tempmail
