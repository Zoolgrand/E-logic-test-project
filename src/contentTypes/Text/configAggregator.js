import { getAdvanced } from '@magento/pagebuilder/lib/utils';

export default node => {
    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    };
};
