/* test cases:
- if one product in xml only - ok
- if multiple products in xml - ok
- if no products in xml - log warning, stop the stream, warning
- if product has no id/description/title - error
- xml is malformed and cant be parsed - error, stop processing
- strips html tags from description/title
- if empty file - log warning, no error
- if no <item> elements in <channel> - log warning, no error
 */
