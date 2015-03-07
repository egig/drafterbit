<?php namespace Drafterbit\Extensions\System\Models;

class Log extends \Drafterbit\Base\Model
{

    public function all()
    {
        $queryBuilder = $this['db']->createQueryBuilder();
        $stmt = $queryBuilder
            ->select('l.*')
            ->from('#_logs', 'l')
            ->orderBy('time', 'DESC');
        return $stmt->execute()->fetchAll();
    }

    public function recent()
    {
        $queryBuilder = $this['db']->createQueryBuilder();
        $stmt = $queryBuilder
            ->select('l.*')
            ->from('#_logs', 'l')
            ->orderBy('time', 'DESC')->setMaxResults(5);

        return $stmt->execute()->fetchAll();
    }

    public function delete($id)
    {
        return $this['db']->delete('#_logs', ['id' => $id]);
    }

    public function clear()
    {
        return $this['db']->exec('TRUNCATE TABLE #_logs');
    }

    /**
     * Format log message
     *
     * @param  string $line
     * @return string
     */
    public function format($line)
    {
        //first we will try translate it
        $line = $this->translate($line);

        // we'll find words formatted like ":user:1"
        // then replace it with format function
        // defined in each extension.
        return preg_replace_callback(
            '/:(\w+:[1-9]+)/',
            function ($matches) {

                $temp = explode(':', $matches[1]);
                
                $entity = current($temp);
                $id = end($temp);

                return $this->getEntityLabel($entity, $id);
            },
            $line
        );
    }

    public function translate($line)
    {
        $chunks = preg_split('/:(\w+:[1-9]+)/', $line);

        foreach (array_filter($chunks) as $chunk) {
            $chunk = trim($chunk);
            $line = str_replace($chunk, __($chunk), $line);
        }

        return $line;
    }

    /**
     * Get entity label for log message
     *
     * @return string
     */
    private function getEntityLabel($entity, $id)
    {
        return $this['app']->getLogEntityLabel($entity, $id);
    }
}
