import React from "react"
import PropTypes from "prop-types"
import { observable, computed, action, reaction } from "mobx"
import { observer } from "mobx-react"
import { SelectField } from "./index"

@observer
export default class PaginationControls extends React.Component {
  static propTypes = {
    collection: PropTypes.object,
    hideSelect: PropTypes.bool,
    noSummary: PropTypes.bool,
    onPageChange: PropTypes.func,
    page: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    perPage: PropTypes.number,
    showSelect: PropTypes.bool,
  }

  static defaultProps = {
    perPage: 5,
    page: 1,
    onPageChange: () => {},
  }

  constructor(props) {
    super(props)

    const { collection } = this.props
    this.currentPage = this.props.page

    if(collection){
      collection.count().then(count => (this.totalRecords = count))

      reaction(
        () => this.props.perPage,
        perPage => {
          if(perPage) collection.limit(perPage)
        },
        true,
      )

      reaction(
        () => this.offset,
        offset => {
          collection.offset(offset)
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
    
  }

  @action
  componentWillReceiveProps(props) {
    if (this.props.page !== props.page) {
      this.currentPage = props.page
    }
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

  range(start, end) {
    return Array(end - start + 1).
      fill().
      map((_, idx) => start + idx)
  }

  pageNumberArray() {
    let showRange = 2

    let showFrom = Number(this.currentPage) - showRange
    let showTo = Number(this.currentPage) + showRange
    if (showTo > this.pageCount) {
      showFrom -= showTo - this.pageCount
      showTo = this.pageCount
    }

    if (showFrom < 1) {
      showTo += 1 - showFrom
      showFrom = 1

      if (showTo > this.pageCount) {
        showTo = this.pageCount
      }
    }

    let middleArray = this.range(showFrom, showTo)
    let left = []
    let right = []

    if (showRange + 3 < middleArray[0]) {
      left = this.range(1, showRange + 1)
      // left << :gap
    } else {
      left = this.range(1, middleArray[0] - 1)
    }

    if (this.pageCount - showRange - 2 > middleArray[middleArray.length - 1]) {
      right = this.range(this.pageCount - showRange, this.pageCount)
    } else {
      right = this.range(middleArray[middleArray.length - 1] + 1, this.pageCount)
    }

    if (left[left.length - 1] === middleArray[0] - 1) {
      left = []
      middleArray = this.range(1, middleArray[middleArray.length - 1])
    }

    if (middleArray[middleArray.length - 1] === right[0] - 1) {
      middleArray = middleArray.concat(right)
      right = []
    }

    return [left, middleArray, right]
  }

  renderPageNumbers = array => {
    const currentPage = this.currentPage
    return array.map(int => (
      <a
        key={int}
        className={`pagination__number${int === Number(currentPage) ? ` active` : ``}`}
        onClick={() => this.gotoPage(int)}
      >
        {int}
      </a>
    ))
  }

  handleChange = val => {
    this.gotoPage(val)
  }

  renderSelectPageChange() {
    if (this.props.showSelect || (!this.props.hideSelect && this.pageCount > 7)) {
      return (
        <div className="pagination__jump">
          <span>Goto:</span>
          <SelectField
            value={this.currentPage}
            choices={this.range(1, this.pageCount)}
            onChange={this.handleChange}
          />
        </div>
      )
    }
  }

  render() {
    if(!this.props.collection) return null
    if (!this.totalRecords) return null

    const prevButton = this.firstPage ? (
      <a className="disabled pagination__previous">Previous</a>
    ) : (
      <a className="pagination__previous" onClick={this.handlePrevious}>
        Previous
      </a>
    )

    const nextButton = this.firstPage ? (
      <a className="disabled pagination__next">Next</a>
    ) : (
      <a className="pagination__next" onClick={this.handleNext}>
        Next
      </a>
    )

    return (
      <div className="pagination__wrapper">
        {this.pageCount > 1 && (
          <div className="pagination">
            {prevButton}
            {this.pageNumberArray().
              filter(x => x.length > 1).
              map((handFeet, i) => (
                <React.Fragment key={i}>
                  {i !== 0 && `...`}
                  {this.renderPageNumbers(handFeet)}
                </React.Fragment>
              ))}
            {nextButton}
            {this.renderSelectPageChange()}
          </div>
        )}
        {!this.props.noSummary && (
          <div className="pagination__summary">
            {this.offset + 1}-{Math.min(this.offset + this.props.perPage, this.totalRecords)}
            {` of `}
            {this.totalRecords}
          </div>
        )}
      </div>
    )
  }
}
