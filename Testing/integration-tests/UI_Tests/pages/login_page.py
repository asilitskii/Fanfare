from utils.locators import *
from utils import users_lists

class LoginPage():
    def __init__(self):
        self.locator = LoginPageLocators

    def check_page_loaded(self, sb):
        return True if sb.find_element(*self.locator.LOGIN_PAGE) else False
    
    def check_only_ASCII_characters(self,str):
        return str.isascii()
    
    def click_sign_up_button(self, sb):
        sb.find_element(*self.locator.GO_TO_REGISTER_PAGE_BUTTON).click()

    def enter_email(self, sb, email):
        sb.find_element(*self.locator.EMAIL).send_keys(email)
    
    def clear_email(self,sb):
        sb.find_element(*self.locator.EMAIL).clear()

    def enter_password(self, sb, password):
        sb.find_element(*self.locator.PASSWORD).send_keys(password)

    def clear_password(self, sb):
        sb.find_element(*self.locator.PASSWORD).clear()

    def click_login_button(self, sb):
        sb.find_element(*self.locator.SUBMIT_SIGN_IN).click()

    def login(self, sb, user, user_list):
        user = users_lists.get_user_by_name(user, user_list)
        print(user)
        self.enter_email(sb, user["email"])
        self.enter_password(sb, user["password"])
        self.click_login_button(sb)

    def login_with_valid_user(self,sb, user, user_list):
        self.login(sb, user, user_list)

    def login_with_in_valid_user(self, sb, user, user_list):
        self.login(sb, user, user_list)
        return sb.find_element(*self.locator.ERROR_LOGIN_MESSAGE)
