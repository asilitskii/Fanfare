from pages.login_page import *
from pages.register_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from omkar_temp_mail import TempMail
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')
INVALID_VERIFICATION_CODE = os.getenv('INVALID_VERIFICATION_CODE')

BaseCase.main(__name__, __file__)

class RegisterPageSignUp(BaseCase):
    def test_sign_up_with_valid_user(self):
        self.open(f'{BASE_URL}register')
        
        page = RegisterPage()

        page.register(self, "valid_user", base_users, True)

        self.find_element(*WaitingConfirmPageLocators.WAITING_CONFIRM_PAGE)

    def test_verify_user_account_success(self):
        user = get_user_by_name("valid_user", base_users)

        link = TempMail.get_email_link(user["email"])

        self.open(link)

        self.find_element(*VerificationPageLocators.RETURN_TO_LOGIN_PAGE_BUTTON).click()
