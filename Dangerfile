# WARNINGS
# make it more obvious that a PR is a work in progress and shouldn't be merged yet
warn("PR is classed as Work in Progress") if github.pr_title.include? "WIP"
# warn when there is a big PR :metal:
warn("Big PR") if git.lines_of_code > 666
# warn when there should be a tiny label
warn("Add the 'tiny' label") if git.lines_of_code < 50 && github.labels.empty?

# FAILURES
# don't let testing shortcuts get into master by accident
fail(".only left in test suite") if `grep -r -e '\.only' test/`.length > 0
# make sure all npm packages are locked down
fail("Lock down package versions") if `grep -e '"~' -e '"\^' -e '">' -e '">=' -e '"<' -e '"<=' package.json`.length > 0

# GENERIC MESSAGING
message("Nice, more deletions than insertions :red_circle:") if git.deletions > gid.insertions
message(":metal:") if `grep -e '666' git.modified_files`.length > 0
