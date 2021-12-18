/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { ToggleControl, Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import Product from './product';

/**
 * Internal Dependencies
 */
import './style.scss';
import Methods from './methods';

const randomId = () => {
	return Math.random().toString( 36 ).substring( 2, 8 );
};

const defaultSettings = {
	enabled: false,
	recurring: false,
	methods: {},
	products: {
		[ randomId() ]: {},
	},
};

const PaymentsPage = ( { params } ) => {
	const formId = params.id;

	const [ settings, setSettings ] = useState( {
		...defaultSettings,
		...ConfigApi.getInitialPayload().payments,
	} );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	const setSetting = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const productsItems = Object.entries( settings.products ).map(
		( [ id, product ], index ) => (
			<Product
				key={ id }
				data={ product }
				onAdd={ () => {
					const products = Object.entries( settings.products );
					products.splice( index + 1, 0, [ randomId(), {} ] );
					setSetting( 'products', Object.fromEntries( products ) );
				} }
				onRemove={ () => {
					const products = { ...settings.products };
					delete products[ id ];
					setSetting( 'products', products );
				} }
				onUpdate={ ( data ) => {
					const products = { ...settings.products };
					products[ id ] = data;
					setSetting( 'products', products );
				} }
				removeEnabled={ Object.entries( settings.products ).length > 1 }
			/>
		)
	);

	return (
		<div className="quillforms-payments-page">
			<div className="quillforms-payments-page-settings">
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Enable
					</div>
					<ToggleControl
						checked={ settings.enabled }
						onChange={ () =>
							setSetting( 'enabled', ! settings.enabled )
						}
					/>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Recurring
					</div>
					<ToggleControl
						checked={ settings.recurring }
						onChange={ () =>
							setSetting( 'recurring', ! settings.recurring )
						}
					/>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Methods
					</div>
					<div
						className={ css`
							margin-top: 5px;
						` }
					>
						<Methods
							settings={ settings }
							onChange={ ( methods ) => {
								setSetting( 'methods', methods );
							} }
						/>
					</div>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Products
					</div>
					<div>{ productsItems }</div>
				</div>
				<div>
					<Button
						className="quillforms-payments-page-settings-save"
						isPrimary
						onClick={ () => {
							apiFetch( {
								path:
									`/wp/v2/quill_forms/${ formId }` +
									`?context=edit&_timestamp=${ Date.now() }`,
								method: 'POST',
								data: {
									payments: settings,
								},
							} )
								.then( () => {
									createSuccessNotice(
										'🚀 Saved successfully!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								} )
								.catch( () => {
									createErrorNotice(
										'⛔ Error while saving!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								} );
						} }
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PaymentsPage;
