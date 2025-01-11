from selenium.webdriver.common.by import By

class LoginPageLocators(object):
    LOGIN_PAGE = (By.XPATH, '//*[contains (@class, "loginPage")]')
    EMAIL = (By.NAME, 'email')
    PASSWORD = (By.NAME, 'password')
    SUBMIT_SIGN_IN = (By.XPATH, '//button[contains(., "Войти")]')
    GO_TO_REGISTER_PAGE_BUTTON = (By.XPATH, '//button[contains(., "Зарегистрироваться")]')
    ERROR_LOGIN_MESSAGE = (By.XPATH, '//*[contains (@class, "serverMsg")]')
    WARNING_FIELD_ERROR_MESSAGE = (By.XPATH, '//*[contains (@class, "error")]')

class RegisterPageLocators(object):
    REGISTER_PAGE = (By.XPATH, '//*[contains (@class, "registerPage")]')
    EMAIL = (By.NAME, 'email')
    PASSWORD = (By.NAME, 'password')
    REPEAT_PASSWORD = (By.NAME, 'passwordConfirmation')
    FIRST_NAME = (By.NAME, 'firstName')
    LAST_NAME = (By.NAME, 'lastName')
    BIRTH_DATE = (By.NAME, 'birthdate')
    TERMS_OF_USE = (By.NAME, 'acceptTOS')
    ERROR_SIGNUP_MESSAGE = (By.XPATH, '//*[contains (@class, "error")][0]')
    SUBMIT_SIGN_UP_BUTTON = (By.XPATH, '//*[contains (@class, "registerBtn")]')

class WaitingConfirmPageLocators(object):
    WAITING_CONFIRM_PAGE = (By.XPATH, '//*[contains (@class, "confirmPage")]')

class VerificationPageLocators(object):
    RETURN_TO_LOGIN_PAGE_BUTTON = (By.XPATH, '//button[contains(., "На главную")]')
    RETURN_TO_HOME_PAGE_BUTTON = (By.XPATH, '//button[contains(., "На главную")]')

class HomePageLocators(object):
    USER_ACCOUNT = (By.XPATH, '//*[contains (., "Личный кабинет")]')
