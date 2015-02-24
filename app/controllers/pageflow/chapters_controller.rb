module Pageflow
  class ChaptersController < Pageflow::ApplicationController
    respond_to :json

    before_filter :authenticate_user!

    def create
      entry = DraftEntry.find(params[:entry_id])
      chapter = entry.chapters.build(chapter_params)

      authorize!(:create, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.save

      respond_with(chapter)
    end

    def update
      chapter = Chapter.find(params[:id])

      authorize!(:update, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.update_attributes(chapter_params)

      respond_with(chapter)
    end

    def order
      entry = DraftEntry.find(params[:entry_id])

      authorize!(:edit_outline, entry.to_model)
      verify_edit_lock!(entry)
      params.require(:ids).each_with_index do |id, index|
        entry.chapters.update(id, :position => index)
      end

      head :no_content
    end

    def destroy
      chapter = Chapter.find(params[:id])

      authorize!(:destroy, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.entry.snapshot(:creator => current_user)

      chapter.destroy

      respond_with(chapter)
    end

    def update_configurations
      # Expects an json-array of objects in body.
      # Each object contains attributes 'chapterId' and 'configuration':
      # [{
      #   chapterId: 1,
      #   configuration: {
      #     row: 1,
      #     lane: 2
      #   }
      # }]
      entry = DraftEntry.find(params[:entry_id])
      authorize!(:edit_outline, entry.to_model)

      req = ActiveSupport::JSON.decode(request.body)
      req.each do |update|
        entry.chapters.update(update['chapterId'], :configuration => update['configuration'])
      end

      head :internal_server_error
    end

    private

    def chapter_params
      params.require(:chapter).permit(:position, :title)
    end
  end
end
