/**
 * QuillForms Dependencies
 */
import { MergeTags, RichTextControl } from '../../rich-text';
import Button from '../../button';

/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { useComboboxControlContext } from '../context';

interface Props {
	placeholder?: string;
}

const RichText: React.FC< Props > = ( { placeholder } ) => {
	const {
		// sections,
		options,
		value,
		onChange,
		isToggleEnabled,
	} = useComboboxControlContext();

	let tags: MergeTags = [];
	for ( const option of options ) {
		if ( option.isMergeTag ) {
			tags.push( {
				type: option.type,
				modifier: option.value,
				label: option.label,
				icon: option.iconBox?.icon,
				color: option.iconBox?.color,
			} );
		}
	}

	return (
		<div className="combobox-control-rich-text">
			{ isToggleEnabled && (
				<Button
					className="combobox-control-rich-text-back"
					onClick={ () => onChange( {} ) }
				>
					<Icon icon={ closeSmall } />
				</Button>
			) }
			<RichTextControl
				value={ value.value ?? '' }
				setValue={ ( value ) => onChange( { type: 'text', value } ) }
				mergeTags={ tags }
				placeholder={ placeholder }
			/>
		</div>
	);
};

export default RichText;
