module Pageflow
  # Represents a set of configuration changes that can be performed
  # based on account or entry feature flags.
  #
  # @since 0.8
  class Feature
    # Unique identifyer of feature.
    #
    # @return [String]
    attr_reader :name

    # Create a block based feature.
    #
    # @param [String] name  Unique identifyer of feature.
    # @yieldparam [Configuration] config  The configuration object to manipulate.
    def initialize(name, &block)
      @name = name
      @block = block
    end

    # Perform any configuration change that is needed to activate this
    # feature.
    #
    # @param [Configuration] config
    def enable(config)
      @block.call(config) if @block
    end

    def name_translation_key
      "pageflow.#{name}.feature_name"
    end
  end
end
