/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2024, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

/*
This test suite is dedicated to tests which verify form functionality in isolation
*/

import { fileURLToPath } from 'url';
import { v4 as genUuid } from 'uuid';

import { createDomainObjectWithDefaults } from '../../appActions.js';
import { expect, test } from '../../pluginFixtures.js';

const TEST_FOLDER = 'test folder';
const jsonFilePath = 'test-data/ExampleLayouts.json';
const imageFilePath = 'test-data/rick.jpg';

test.describe('Form Validation Behavior', () => {
  test('Required Field indicators appear if title is empty and can be corrected', async ({
    page
  }) => {
    //Go to baseURL
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('menuitem', { name: 'Folder' }).click();

    // Fill in empty string into title and trigger validation with 'Tab'
    await page.getByLabel('Title', { exact: true }).fill('');
    await page.getByLabel('Title', { exact: true }).press('Tab');

    //Required Field Form Validation
    await expect(page.getByLabel('Save')).toBeDisabled();
    await expect(page.locator('.c-form-row__state-indicator').first()).toHaveClass(/invalid/);

    //Correct Form Validation for missing title and trigger validation with 'Tab'
    await page.getByLabel('Title', { exact: true }).fill(TEST_FOLDER);
    await page.getByLabel('Title', { exact: true }).press('Tab');

    //Required Field Form Validation is corrected
    await expect(page.getByLabel('Save')).toBeEnabled();
    await expect(page.locator('.c-form-row__state-indicator').first()).not.toHaveClass(/invalid/);

    //Finish Creating Domain Object
    await page.getByLabel('Save').click();

    //Verify that the Domain Object has been created with the corrected title property
    await expect(page.locator('.l-browse-bar__object-name')).toContainText(TEST_FOLDER);
  });
});

test.describe('Form File Input Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({
      path: fileURLToPath(new URL('../../helper/addInitFileInputObject.js', import.meta.url))
    });
  });

  test('Can select a JSON file type', async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('menuitem', { name: 'JSON File Input Object' }).click();

    await page.setInputFiles('#fileElem', jsonFilePath);

    await page.getByRole('button', { name: 'Save' }).click();

    const type = page.locator('#file-input-type');
    await expect(type).toHaveText(`"string"`);
  });

  test('Can select an image file type', async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('menuitem', { name: 'Image File Input Object' }).click();

    await page.setInputFiles('#fileElem', imageFilePath);

    await page.getByRole('button', { name: 'Save' }).click();

    const type = page.locator('#file-input-type');
    await expect(type).toHaveText(`"object"`);
  });
});

test.describe('Persistence operations @addInit', () => {
  // add non persistable root item
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({
      path: fileURLToPath(new URL('../../helper/addNoneditableObject.js', import.meta.url))
    });
  });

  test('Persistability should be respected in the create form location field', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/nasa/openmct/issues/4323'
    });
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByRole('menuitem', { name: 'Condition Set' }).click();

    await page.locator('form[name="mctForm"] >> text=Persistence Testing').click();

    const okButton = page.getByLabel('Save');
    await expect(okButton).toBeDisabled();
  });
});

test.describe('Form Correctness by Object Type', () => {
  test.fixme('Verify correct behavior of number object (SWG)', async ({ page }) => {});
  test.fixme('Verify correct behavior of number object Timer', async ({ page }) => {});
  test.fixme('Verify correct behavior of number object Plan View', async ({ page }) => {});
  test.fixme('Verify correct behavior of number object Clock', async ({ page }) => {});
  test.fixme('Verify correct behavior of number object Hyperlink', async ({ page }) => {});
});
