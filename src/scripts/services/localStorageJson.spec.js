describe('localStorageJson', function () {

	var TEST_KEY = "storeMe";

	beforeEach(
		module('localStorageJson')
	);

	it('should store simple values', testStoredValue("abc123DEF"));

	it('should store objects', testStoredValue({
		title: "Dr",
		surname: "Teeth"
	}));

	it('should store arrays', testStoredValue([
		"Dr Teeth",
		"Floyd Pepper",
		"Animal",
		"Janice",
		"Zoot"
	]));

	it('should gracefully handle invalid JSON values', inject(function ($window, localStorageJson) {
		$window.localStorage[TEST_KEY] = "['abc";
		expect(localStorageJson.get(TEST_KEY)).toBe(undefined);
	}));

	it('should handle keys that have not been stored', inject(function (localStorageJson) {
		expect(localStorageJson.get(TEST_KEY)).toBe(undefined);
	}));

	function testStoredValue(testValue) {
		return inject(function (localStorageJson){
			localStorageJson.put(TEST_KEY, testValue);
			var retrievedValue = localStorageJson.get(TEST_KEY);

			expect(retrievedValue).toEqual(testValue);
		});
	}

});