/* eslint-disable no-undef */
import nock from 'nock';
import { expectRedux, storeSpy } from 'expect-redux';
import configureStore from '../index';

import * as actions from '../actions/categories';
import * as types from '../types/categories';
import normalizeData from '../utils/normalizer';
import { categorySchema } from '../sagas/schema';

expectRedux.configure({ betterErrorMessagesTimeout: 1000 });

const categoriesResponse = [
  {
    _id: '5c1f8f78bbfd51296cb0ba8b',
    parent: null,
    isChild: false,
    name: '자바',
    children: [
      {
        _id: '5c1f8f7fbbfd51296cb0ba8c',
        parent: '5c1f8f78bbfd51296cb0ba8b',
        isChild: true,
        name: '스크립트',
        children: [],
      },
    ],
  },
];

const { entities } = normalizeData(categoriesResponse, [categorySchema]);
const normalizedCategories = entities.categories;

const categoriesSelector = state => state.newEntities.categories;

function setupStore() {
  return configureStore([storeSpy]);
}

describe('스토어 categories', () => {
  it('categories의 기본값은 빈 객체{} 다', () => {
    const store = setupStore();
    const categories = categoriesSelector(store.getState());

    expect(categories).toEqual({});
  });

  describe('LOAD_CATEGORIES', () => {
    beforeEach(() => {
      nock('http://localhost')
        .get('/api/v1/categories')
        .reply(200, categoriesResponse);
    });

    afterAll(() => {
      nock.cleanAll();
    });

    it('카테고리가 없으면 카테고리를 fetch한다', async () => {
      // Given
      const store = setupStore();

      // When
      store.dispatch(actions.loadCategories());

      // Then
      await expectRedux(store)
        .toDispatchAnAction()
        .ofType(types.GET_CATEGORIES_SUCCESS);

      await expectRedux(store)
        .toHaveState()
        .withSubtree(categoriesSelector)
        .matching(normalizedCategories);
    });

    it('스토어에 카테고리정보가 있다면 fetch하지 않는다', async () => {
      // Given
      const store = setupStore();
      store.dispatch(actions.loadCategories());

      await expectRedux(store)
        .toDispatchAnAction()
        .ofType(types.GET_CATEGORIES_SUCCESS);

      // When
      store.dispatch(actions.loadCategories());

      // Then
      await expectRedux(store)
        .toDispatchAnAction()
        .ofType(types.LOAD_CATEGORIES_SUCCESS);
    });
  });

  describe('GET_CATEGORY', () => {
    describe('카테고리가 없을 때', () => {
      it('성공하면 새로운 카테고리가 추가된다', async () => {
        // Given
        const newCategory = {
          _id: 'newID',
          parent: null,
          isChild: false,
          name: 'NEW CATEGORY',
          children: [],
        };

        const result = normalizeData(newCategory, categorySchema);
        const { categories: normalizedNewCategory } = result.entities;

        nock('http://localhost')
          .get(`/api/v1/categories/${newCategory._id}`)
          .reply(200, newCategory);

        const store = setupStore();

        // When
        store.dispatch(actions.getCategoryRequest(newCategory._id));

        // Then
        await expectRedux(store)
          .toDispatchAnAction()
          .ofType(types.GET_CATEGORY_SUCCESS);

        await expectRedux(store)
          .toHaveState()
          .withSubtree(categoriesSelector)
          .matching(normalizedNewCategory);
      });
    });

    describe.skip('카테고리가 이미 존재할 때', () => {
      it('성공하면 새로운 카테고리가 추가된다', async () => {
        await Promise.resolve();
      });
    });
  });
});