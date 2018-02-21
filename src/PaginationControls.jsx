import React from "react"
import PropTypes from "prop-types"
import { observable, computed, action, reaction } from "mobx"
import { observer } from "mobx-react"

@observer
export default class PaginationControls extends React.Component {
  propTypes = {
    collection: PropTypes.object,
    perPage: PropTypes.number,
  }

  static defaultProps = {
    perPage: 5,
    page: 1,
    onPageChange: () => {},
  }

  @observable totalRecords
  @observable perPage
  @observable currentPage = 1

  get perPage() {
    return this.props.perPage
  }

  @computed
  get pageCount() {
    return Math.ceil(this.totalRecords / this.props.perPage)
  }

  @computed
  get offset() {
    return this.props.perPage * (this.currentPage - 1)
  }

  @computed
  get isFirstPage() {
    return this.currentPage === 1
  }

  @computed
  get isLastPage() {
    return this.currentPage === this.pageCount
  }

  @action
  handlePrevious = e => {
    if (this.currentPage > 1) this.currentPage--
  }

  @action
  handleNext = e => {
    if (this.currentPage < this.pageCount) this.currentPage++
  }

  @action
  gotoPage(n) {
    this.currentPage = n
  }

  constructor(props) {
    super(props)

    const { collection } = this.props
    this.currentPage = this.props.page

    collection.count().then(count => (this.totalRecords = count))

    reaction(
      () => this.props.perPage,
      perPage => {
        collection.limit(perPage)
      },
      true,
    )

    reaction(
      () => this.offset,
      offset => {
        this.props.collection.offset(offset)
      },
      true,
    )

    let { _query, _sort, _scope } = collection

    collection.onChange(async () => {
      const coll = collection.dup()
      coll.unlimit()
      coll.unoffset()
      this.totalRecords = await coll.count()

      if (
        _query !== collection._query ||
        _sort !== collection._sort ||
        _scope !== collection._scope
      ) {
        if (this.currentPage > 1) this.currentPage = 1
        _query = collection._query
        _sort = collection._sort
        _scope = collection._scope
      }
    })

    reaction(() => this.currentPage, page => this.props.onPageChange(page))
  }

  @action
  componentWillReceiveProps(props) {
    if (this.props.page !== props.page) {
      this.currentPage = props.page
    }
  }

  render() {
    if (!this.totalRecords) return null

    const prevButton = this.firstPage ? (
      <a className="disabled pagination__previous">Previous</a>
    ) : (
      <a className="pagination__previous" onClick={this.handlePrevious}>Previous</a>
    )

    const nextButton = this.firstPage ? (
      <a className="disabled pagination__next">Next</a>
    ) : (
      <a className="pagination__next"  onClick={this.handleNext}>Next</a>
    )

    return (
      <div className='pagination__wrapper'>
        {
          this.pageCount > 1 &&
          <div className="pagination">
            {prevButton}
            {Array(this.pageCount)
            .fill(0)
            .map((_, p) => <a className="pagination__number" onClick={() => this.gotoPage(p + 1)}>{p + 1}</a>)}
            {nextButton}
          </div>
        }
        <div className="pagination__summary">
          {this.offset + 1}-{Math.min(this.offset + this.props.perPage, this.totalRecords)}
          {` of `}
          {this.totalRecords}
        </div>
      </div>
    )
  }
}
