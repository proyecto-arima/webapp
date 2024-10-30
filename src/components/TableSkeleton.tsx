import { Placeholder, Table } from "reactstrap";

export default function TableSkeleton(props: { columnsCount?: number }) {
  return <Table>
    <thead>
      <tr>
        {Array.from({ length: props.columnsCount ?? 3 }).map((_, i) => <th key={i}><Placeholder as="div" animation="glow">
          <Placeholder xs={6} />
        </Placeholder></th>)}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 20 }).map((_, i) => <tr key={i}>
        {Array.from({ length: props.columnsCount ?? 3 }).map((_, i) => <td key={i}><Placeholder as="div" animation="glow"><Placeholder xs={6} /></Placeholder></td>)}
      </tr>)}
    </tbody>
  </Table>
}