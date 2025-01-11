import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import LoginContainer from './components/login/LoginContainer';
import HomeContainer from './components/home/HomeContainer';
import style from './App.module.scss';
import { RegisterContainer } from './components/register/RegisterContainer';
import EmailVerificationContainer from './components/emailverification/EmailVerificationContainer';
import { AxiosInstance } from './api/API';
import ProfileContainer from './components/profile/ProfileContainer';
import PageNotFound from './components/pagenotfound/PageNotFound';
import ServiceCallError from './components/serviceCallError/ServiceCallError';
import ProfileSettingsContainer from './components/profile/settings/ProfileSettingsContainer';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import MainHeaderContainer from './components/header/MainHeaderContainer';
import RegisterConfirmation from './components/register/RegistorConfirmation';
import StoreCreationContainer from './components/store/creation/StoreCreationContainer';
import StoreHeaderContainer from './components/header/StoreHeaderContainer';
import StoreContainer from './components/store/StoreContainer';
import { SHOP_NOT_FOUND_ERROR_MSG, useStoreStorage } from './zustand/StoreStorage';
import Preloader from './components/assets/preloader/Preloader';
import Modal from './components/assets/modal/Modal';
import InvoiceCard from './components/store/cards/InvoiceCard';
import ProductPageHeaderContainer from './components/header/ProductPageHeaderContainer';
import PasswordResetRequestContainer from './components/passwordreset/PasswordResetRequestContainer';
import PasswordResetInstruction from './components/passwordreset/PasswordResetInstruction';
import PasswordResetContainer from './components/passwordreset/PasswordResetContainer';
import { useProductWithStoreLogoStorage } from './zustand/ProductWithStoreLogoStorage';
import ProductContainer from './components/product/ProductContainer';
import OrderContainer from './components/order/OrderContainer';
import ProductCreationContainer from './components/product/creation/ProductCreationContainer';
import OrderCreationContainer from './components/order/creation/OrderCreationContainer';
import { useCookies } from 'react-cookie';
import { useProductStorage } from './zustand/ProductStorage';
import OrderListContainer from './components/profile/data/order/seller/list/OrderListContainer';

const AppContainer: React.FC = () => {
	return (
		<AxiosInstance>
			<App />
		</AxiosInstance>
	);
};

const App: React.FC = () => {
	return (
		<>
			<BrowserRouter
				future={{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					v7_startTransition: true,
				}}
			>
				<Routes>
					<Route path={'/'} element={<Navigate to={'/home'} />} />
					<Route
						path={'/email-verification/:code'}
						element={
							<div className={style.registrationFinalPage}>
								<EmailVerificationContainer />
							</div>
						}
					/>

					<Route
						path={'/login'}
						element={
							<div className={style.loginPage}>
								<LoginContainer />
							</div>
						}
					/>
					<Route
						path={'/register'}
						element={
							<div className={style.registerPage}>
								<RegisterContainer />
							</div>
						}
					/>
					<Route
						path={'/confirm'}
						element={
							<div className={style.registrationFinalPage}>
								<RegisterConfirmation />
							</div>
						}
					/>
					<Route path={'/home'} element={<HomeContainer />} />
					<Route
						path={'/profile'}
						element={
							<div className={style.pageWithDefaultHeader}>
								<MainHeaderContainer />
								<ProfileContainer />
							</div>
						}
					/>
					<Route
						path={'/profile/settings'}
						element={
							<div className={style.pageWithDefaultHeader}>
								<MainHeaderContainer />
								<ProfileSettingsContainer />
							</div>
						}
					/>
					<Route
						path={'/store/new'}
						element={
							<div className={style.storeCreationPage}>
								<StoreCreationContainer />
							</div>
						}
					/>
					<Route path={'/password-reset'} element={<PasswordResetRequestContainer />} />
					<Route
						path={'/password-reset/instruction'}
						element={<PasswordResetInstruction />}
					/>
					<Route path={'/password-reset/:code'} element={<PasswordResetContainer />} />
					<Route path={'/404'} element={<PageNotFound />} />
					<Route path={'/500'} element={<ServiceCallError />} />
					<Route
						path={'/store/:storeId'}
						element={
							<WithStoreHeader>
								<StoreContainer />
							</WithStoreHeader>
						}
					/>
					<Route
						path={'item/new'}
						element={
							<div className={style.productCreationPage}>
								<ProductCreationContainer />
							</div>
						}
					/>
					<Route
						path={'/item/:itemId'}
						element={
							<WithProductPageHeader>
								<ProductContainer />
							</WithProductPageHeader>
						}
					/>
					<Route
						path={'/order/new'}
						element={
							<OrderPageHeader>
								<OrderCreationContainer />
							</OrderPageHeader>
						}
					/>
					<Route
						path={'/order/:orderId'}
						element={
							<div className={style.pageWithDefaultHeaderOverflowed}>
								<OrderContainer />
							</div>
						}
					/>
					<Route
						path={'/order/all'}
						element={
							<div className={style.pageWithDefaultHeader}>
								<MainHeaderContainer />
								<OrderListContainer />
							</div>
						}
					/>
					<Route path={'*'} element={<Navigate to={'/404'} />} />
				</Routes>
			</BrowserRouter>

			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	);
};

type WithStoreHeaderProps = {
	children: React.ReactNode;
};

const WithStoreHeader: React.FC<WithStoreHeaderProps> = ({ children }) => {
	const { storeId } = useParams() as { storeId: string };
	const {
		loadLogo,
		logo,
		getInvoice,
		getTgInfo,
		getTgSubscribed,
		tgData,
		invoice,
		tgIsSubscribed,
	} = useStoreStorage();
	const navigate = useNavigate();

	const [modalIsActive, setModalIsActive] = useState(false);

	const onInvoiceClick = () => {
		setModalIsActive(true);
	};

	const loadFunc = async () => {
		try {
			await getInvoice(storeId);
		} catch (e) {
			const error = e as Error;
			if (error.message === SHOP_NOT_FOUND_ERROR_MSG) {
				navigate('/404');
			}
		}

		Promise.all([loadLogo(storeId), getTgSubscribed(storeId), getTgInfo(storeId)])
			.then()
			.catch((e) => {
				const error = e as Error;
				if (error.message === SHOP_NOT_FOUND_ERROR_MSG) {
					navigate('/404');
				}
			});
	};

	useEffect(() => {
		loadFunc().then();
	}, [storeId, loadLogo, navigate]);

	if (!logo) {
		return (
			<div className={style.loading + ' ' + style.storeHeaderPadding}>
				<Preloader />
			</div>
		);
	}

	return (
		<div className={style.pageWithDefaultHeader}>
			<StoreHeaderContainer logo={logo} onInvoiceClick={onInvoiceClick} />
			{children}
			<Modal active={modalIsActive} setActive={setModalIsActive}>
				<InvoiceCard
					tgBoostCost={tgData?.perBoostPoints}
					tgCommentCost={tgData?.perCommentPoints}
					tgIsSubscribed={tgIsSubscribed}
					invoiceValue={invoice}
				/>
			</Modal>
		</div>
	);
};

type WithProductPageHeaderProps = {
	children: React.ReactNode;
};

const WithProductPageHeader: React.FC<WithProductPageHeaderProps> = ({ children }) => {
	const { itemId } = useParams<{ itemId: string }>();
	const { loadLogo, logo, error, storeId } = useProductWithStoreLogoStorage();
	const navigate = useNavigate();

	useEffect(() => {
		if (itemId) {
			loadLogo(itemId);
		}
	}, [itemId, loadLogo]);

	if (error) {
		navigate('/404');
		return <></>;
	}

	if (!logo || !storeId) {
		return (
			<div className={style.loading}>
				<Preloader />
			</div>
		);
	}

	return (
		<div className={style.pageWithProductHeader}>
			<ProductPageHeaderContainer logo={logo} storeId={storeId} />
			{children}
		</div>
	);
};

const OrderPageHeader: React.FC<WithProductPageHeaderProps> = ({ children }) => {
	const [cookies] = useCookies();
	const { loadLogo, logo } = useStoreStorage();
	const { loadProduct } = useProductStorage();
	const navigate = useNavigate();
	const [storeId, setStoreId] = useState<string | null>(null);

	const itemId = useMemo(() => cookies['itemId'], [cookies]);

	useEffect(() => {
		if (itemId) {
			loadProduct(itemId)
				.then((product) => {
					setStoreId(product.storeId);
					loadLogo(product.storeId)
						.then(() => ({}))
						.catch(() => navigate('/404'));
				})
				.catch((error) => {
					if (error instanceof Error) {
						toast.error(error.message);
					}
				});
		}
	}, [itemId, loadLogo, loadProduct, navigate]);

	if (!itemId) {
		return (
			<div className={style.emptyCart}>
				<h1>Корзина пуста</h1>
			</div>
		);
	}

	if (!logo || !storeId) {
		return (
			<div className={style.loading}>
				<Preloader />
			</div>
		);
	}

	return (
		<div className={style.pageWithProductHeader}>
			<ProductPageHeaderContainer logo={logo} storeId={storeId} />
			{children}
		</div>
	);
};

export default AppContainer;
