repo = github.pr_json[:base][:repo][:full_name]

puts "repo #{repo}"

# FAILURES
# don't let testing shortcuts get into master by accident
fail('.only left in test suite') if `grep -r -e '\w\.only' test/`.length > 0
# make sure all npm packages are locked down
fail('Lock down package versions') if `grep -e '"~' -e '"\^' -e '">' -e '">=' -e '"<' -e '"<=' package.json`.length > 0

