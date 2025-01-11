from utils.locators import *
from utils import users_lists

class RegisterPage():
    def __init__(self):
        self.locator = RegisterPageLocators

    def check_page_loaded(self, sb):
        return True if sb.find_element(*self.locator.REGISTER_PAGE) else False
    
    def click_register_button(self, sb):
        sb.find_element(*self.locator.SUBMIT_SIGN_UP_BUTTON).click()
    
    def click_terms_button(self, sb):
        sb.find_element(*self.locator.TERMS_OF_USE).click()

    def enter_email(self, sb, email):
        sb.find_element(*self.locator.EMAIL).send_keys(email)

    def enter_password(self, sb, password):
        sb.find_element(*self.locator.PASSWORD).send_keys(password)
    
    def enter_repeat_password(self, sb, repeat_password):
        sb.find_element(*self.locator.REPEAT_PASSWORD).send_keys(repeat_password)

    def enter_first_name(self, sb, first_name):
        sb.find_element(*self.locator.FIRST_NAME).send_keys(first_name)
    
    def enter_last_name(self, sb, last_name):
        sb.find_element(*self.locator.LAST_NAME).send_keys(last_name)
    
    def enter_birth_date(self, sb, birth_date):
        sb.find_element(*self.locator.BIRTH_DATE).send_keys(birth_date)

    def clear_field(self, sb, locator):
        sb.find_element(locator).clear()
        
    def register(self, sb, user, user_list, user_generator_active):
        if (user_generator_active and user_list == users_lists.base_users and user == "valid_user"):
            email = users_lists.generate_user_email()
            user = users_lists.get_user_by_name(user, user_list)
            user["email"] = email
        else:
            user = users_lists.get_user_by_name(user, user_list)
        
        self.enter_email(sb, user["email"])
        self.enter_password(sb, user["password"])
        self.enter_repeat_password(sb, user["password"])

        self.enter_first_name(sb, user["first_name"])
        self.enter_last_name(sb, user["last_name"])

        sb.find_element(*self.locator.BIRTH_DATE).click()

        self.enter_birth_date(sb, user["birth_date"])

        self.click_terms_button(sb)
        self.click_register_button(sb)
