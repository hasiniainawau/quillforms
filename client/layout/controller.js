/**
 * QuillForms Dependencies
 */
import { registerAdminPage } from '@quillforms/navigation';
import { FormAdminBar } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Suspense, lazy, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { parse } from 'qs';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import NotFoundPage from '../pages/not-found';
import Home from '../pages/home';
import Builder from '../pages/builder';
import Share from '../pages/share';
import SaveButton from '../pages/builder/save-button';

export const Controller = ( { page, match, location } ) => {
	useEffect( () => {
		window.document.documentElement.scrollTop = 0;
	}, [] );

	const getQuery = ( searchString ) => {
		if ( ! searchString ) {
			return {};
		}

		const search = searchString.substring( 1 );
		return parse( search );
	};

	const { url, params } = match;
	const query = getQuery( location.search );

	return (
		<Suspense fallback={ <div /> }>
			<div
				className={ classnames( 'qf-page-component-wrapper', {
					'has-sidebar':
						! page.template || page.template === 'default',
				} ) }
			>
				<page.component
					params={ params }
					path={ url }
					pathMatch={ page.path }
					query={ query }
				/>
			</div>
		</Suspense>
	);
};

registerAdminPage( 'home', {
	component: Home,
	path: '/',
} );
registerAdminPage( 'builder', {
	component: Builder,
	path: '/forms/:id/builder/',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return (
			<>
				<FormAdminBar formId={ params.id } />
				<SaveButton />
			</>
		);
	},
} );
registerAdminPage( 'share', {
	component: Share,
	path: '/forms/:id/share',
	template: 'full-screen',
	header: ( { match } ) => {
		const { params } = match;
		return <FormAdminBar formId={ params.id } />;
	},
} );
registerAdminPage( 'not_found', {
	component: NotFoundPage,
	path: '*',
} );
