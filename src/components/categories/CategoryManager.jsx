import React from 'react';
import PropTypes from 'prop-types';
import CreateCategory from './CreateCategory';
import DeleteCategory from './DeleteCategory';
import withCategoryContainer from '../../containers/CategoryContainer';

const renderChildCategories = (categories, name) => {
  if (categories[name].children.length === 0) {
    return null;
  }

  return (
    <ul className="subCategoryList">
      {categories[name].children.map(childName => (
        <li name={childName} key={categories[childName]._id}>
          ㄴ{categories[childName].name}
          <DeleteCategory
            id={categories[childName]._id}
          />
        </li>
      ))
      }
    </ul>
  );
};

const CategoryManager = (props) => {
  const { categories, parentCategoryNames } = props;
  const style = { border: '0.5px solid #dddddd' };

  const isEmpty = !parentCategoryNames.length;

  if (isEmpty) {
    return null;
  }

  return (
    <>
      <ul className="categoryList" style={style}>
        {parentCategoryNames.map(name => (
          <li name={name} style={style} key={categories[name]._id}>
            {categories[name].name}
            <DeleteCategory
              id={categories[name]._id}
            />
            {renderChildCategories(categories, name)}
            <CreateCategory
              parent={categories[name]._id}
            />
          </li>
        ))
        }
      </ul>
      <CreateCategory/>
    </>
  );
};

const Category = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parent: PropTypes.string, // default: null
  isChild: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.string).isRequired,
});

CategoryManager.propTypes = {
  categories: PropTypes.objectOf(Category).isRequired,
  parentCategoryNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default withCategoryContainer(CategoryManager);
