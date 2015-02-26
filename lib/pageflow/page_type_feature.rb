module Pageflow
  class PageTypeFeature < Feature
    def initialize(page_type)
      super "page_type.#{page_type.name}" do |config|
        config.page_types.register(page_type)
        config.help_entries.register(page_type.help_entry_translation_key,
                                     parent: 'pageflow.help_entries.page_types')
      end
    end
  end
end
