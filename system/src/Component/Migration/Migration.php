<?php namespace Drafterbit\Component\Migration;

class Migration
{
    /**
     * @var string
     */
    protected $current;

    /**
     * @var array
     */
    protected $parameters;

    /**
     * @var array
     */
    protected $files = [];

    /**
     * Constructor.
     *
     * @param Migrator $migrator
     * @param string   $path
     * @param string   $current
     * @param array    $parameters
     */
    public function __construct(Migrator $migrator, $path, $current = null, $parameters = [])
    {
        $this->current    = $current;
        $this->parameters = array_replace($migrator->getGlobals(), $parameters);
        $this->files      = $this->loadFiles($path, $migrator->getPattern());
    }

    /**
     * Gets migration versions.
     *
     * @param  string|null $version
     * @param  string      $method
     * @return array
     */
    public function get($version = null, $method = 'up')
    {
        if ($method == 'up') {
            $files = $this->load($this->current, $version);
        } else {
            $files = $this->load($version, $this->current, 'down');
        }

        return array_keys($files);
    }

    /**
     * Migrate to a version.
     *
     * @param  string|null $version
     * @return array
     */
    public function run($version = null)
    {
        if (is_null($version) || is_null($this->current) || strnatcmp($this->current, $version) < 0) {
            $value = $this->apply($this->load($this->current, $version));
        } else {
            $value = $this->apply($this->load($version, $this->current, 'down'), 'down');
        }

        return $value;
    }

    /**
     * Applies migrations.
     *
     * @param  array  $files
     * @param  string $method
     * @return string|bool
     */
    protected function apply(array $files, $method = 'up')
    {
        $value = false;

        foreach ($files as $version => $file) {

            extract($this->parameters, EXTR_SKIP);

            $value  = $version;
            $config = require $file;

            if (is_array($config) && isset($config[$method])) {
                call_user_func($config[$method]);
            }
        }

        return $value;
    }

    /**
     * Loads migrations.
     *
     * @param  string|null $start
     * @param  string|null $end
     * @param  string      $method
     * @return string|bool
     */
    protected function load($start = null, $end = null, $method = 'up')
    {
        $files = [];

        foreach ($this->files as $version => $file) {

            if (($start !== null && strnatcmp($start, $version) >= 0) || ($end !== null && strnatcmp($end, $version) < 0)) {
                continue;
            }

            $files[$version] = $file;
        }

        if ($method == 'down') {
            $files = array_reverse($files, true);
        }

        return $files;
    }

    /**
     * Loads all migration files form a given path.
     *
     * @param  string $path
     * @param  string $pattern
     * @throws \InvalidArgumentException
     * @return array
     */
    protected function loadFiles($path, $pattern)
    {
        $files = [];

        if (!is_dir($path)) {
            throw new \InvalidArgumentException(sprintf('Unable to run migrations. Could not find path "%s"', $path));
        }

        foreach (new \DirectoryIterator($path) as $file) {
            if ($file->isFile() && preg_match($pattern, $file->getFilename(), $matches)) {
                $files[$matches['version']] = $file->getPathname();
            }
        }

        uksort($files, 'strnatcmp');

        return $files;
    }
}
