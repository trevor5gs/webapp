repo = 'ello/webapp'

# LABELS
# create tiny
if !github.api.labels(repo).any?{|label| label.name == "tiny"}
  github.api.add_label(repo, 'tiny', 'f7c6c7')
end
# add/remove tiny
issue_has_tiny_label = github.api.labels_for_issue(repo, github.pr_json[:number]).any?{|l| l[:name] == 'tiny'}
if git.lines_of_code < 50 && !issue_has_tiny_label
  github.api.add_labels_to_an_issue(repo, github.pr_json[:number], ['tiny'])
elsif git.lines_of_code > 50 && issue_has_tiny_label
  github.api.remove_label(repo, github.pr_json[:number], ['tiny'])
end

# WARNINGS
# make it more obvious that a PR is a work in progress and shouldn't be merged yet
warn('PR is classed as Work in Progress') if github.pr_title.include? 'WIP'
# warn when there is a big PR :metal:
warn('Big PR') if git.lines_of_code > 666

# FAILURES
# don't let testing shortcuts get into master by accident
fail('.only left in test suite') if `grep -r -e '\w\.only' test/`.length > 0
# make sure all npm packages are locked down
fail('Lock down package versions') if `grep -e '"~' -e '"\^' -e '">' -e '">=' -e '"<' -e '"<=' package.json`.length > 0

# GENERIC MESSAGING
message('Nice, more deletions than insertions :red_circle:') if git.deletions > git.insertions
message('You added the devil somewhere in your code :metal:') if `grep -e '666' #{git.modified_files.join(' ')}`.length > 0
