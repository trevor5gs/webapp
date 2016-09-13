# FAILURES
# don't let testing shortcuts get into master by accident
fail('.only left in test suite') if `grep -r -e '\w\.only' test/`.length > 0
# make sure all npm packages are locked down
fail('Lock down package versions') if `grep -e '"~\d' -e '"\^\d' -e '">\d' -e '">=\d' -e '"<\d' -e '"<=\d' package.json`.length > 0

